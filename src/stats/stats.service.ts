import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
// import { Stats, StatsDocument } from './schemas/stats.schema';
type SummaryResult = {
  _id: TransactionType;
  total: number;
};

import { TransactionType } from 'src/common/enums/transaction-type.enum';
import {
  Transaction,
  TransactionDocument,
} from 'src/transactions/schemas/transaction.schema';

@Injectable()
export class StatsService {
  constructor(
    // @InjectModel(Stats.name) private statsModel: Model<StatsDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async getSummary(userId: string) {
    const result = await this.transactionModel.aggregate<SummaryResult>([
      {
        $match: {
          userId: new Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    result.forEach((r) => {
      if (r._id === TransactionType.INCOME) totalIncome = r.total;
      if (r._id === TransactionType.EXPENSE) totalExpense = r.total;
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  async getMonthlyStats(userId: string, month?: number, year?: number) {
    return this.transactionModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          ...(month && year
            ? {
                $expr: {
                  $and: [
                    { $eq: [{ $month: '$date' }, month] },
                    { $eq: [{ $year: '$date' }, year] },
                  ],
                },
              }
            : {}),
        },
      },

      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },

      {
        $unwind: {
          path: '$category', // Đường dẫn đến field cần unwind
          preserveNullAndEmptyArrays: true, // Giữ lại record nếu category bị null/không tìm thấy
        },
      },

      {
        $group: {
          _id: {
            month: { $month: '$date' },
            type: '$type',
          },

          total: { $sum: '$amount' },

          transactions: {
            $push: {
              _id: '$_id',
              name: '$name', // ← đổi từ category.name sang transaction.name
              amount: '$amount',
              date: '$date', // thêm date để frontend parse
              categoryId: '$category._id',
              categoryName: '$category.name', // tùy chọn nếu muốn hiển thị category
            },
          },
        },
      },

      {
        $group: {
          _id: '$_id.month',

          totalIncome: {
            $sum: {
              $cond: [
                { $eq: ['$_id.type', TransactionType.INCOME] },
                '$total',
                0,
              ],
            },
          },

          totalExpense: {
            $sum: {
              $cond: [
                { $eq: ['$_id.type', TransactionType.EXPENSE] },
                '$total',
                0,
              ],
            },
          },

          incomeTransactions: {
            $push: {
              $cond: [
                { $eq: ['$_id.type', TransactionType.INCOME] },
                '$transactions',
                [],
              ],
            },
          },

          expenseTransactions: {
            $push: {
              $cond: [
                { $eq: ['$_id.type', TransactionType.EXPENSE] },
                '$transactions',
                [],
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          month: '$_id',
          totalIncome: 1,
          totalExpense: 1,
          balance: { $subtract: ['$totalIncome', '$totalExpense'] },

          incomeTransactions: {
            $reduce: {
              input: '$incomeTransactions',
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this'] },
            },
          },

          expenseTransactions: {
            $reduce: {
              input: '$expenseTransactions',
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this'] },
            },
          },
        },
      },

      {
        $sort: { month: 1 },
      },
    ]);
  }

  async getCalendarStats(userId: string, month: number, year: number) {
    return this.transactionModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          $expr: {
            $and: [
              { $eq: [{ $month: '$date' }, month] },
              { $eq: [{ $year: '$date' }, year] },
            ],
          },
        },
      },

      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },

      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $facet: {
          // ================= SUMMARY =================
          summary: [
            {
              $group: {
                _id: '$type',
                total: { $sum: '$amount' },
              },
            },
          ],

          // ================= CALENDAR (grid) =================
          calendar: [
            {
              $group: {
                _id: {
                  date: {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$date',
                    },
                  },
                  type: '$type',
                },
                total: { $sum: '$amount' },
              },
            },
            {
              $group: {
                _id: '$_id.date',
                income: {
                  $sum: {
                    $cond: [
                      { $eq: ['$_id.type', TransactionType.INCOME] },
                      '$total',
                      0,
                    ],
                  },
                },
                expense: {
                  $sum: {
                    $cond: [
                      { $eq: ['$_id.type', TransactionType.EXPENSE] },
                      '$total',
                      0,
                    ],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                date: '$_id',
                income: 1,
                expense: 1,
              },
            },
          ],

          // ================= DAILY LIST =================
          daily: [
            { $sort: { date: -1 } },
            {
              $group: {
                _id: {
                  date: {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$date',
                    },
                  },
                },

                totalIncome: {
                  $sum: {
                    $cond: [
                      { $eq: ['$type', TransactionType.INCOME] },
                      '$amount',
                      0,
                    ],
                  },
                },

                totalExpense: {
                  $sum: {
                    $cond: [
                      { $eq: ['$type', TransactionType.EXPENSE] },
                      '$amount',
                      0,
                    ],
                  },
                },

                transactions: {
                  $push: {
                    _id: '$_id',
                    name: '$name',
                    amount: '$amount',
                    type: '$type',
                    categoryId: '$category._id',
                    categoryName: '$category.name',
                    date: '$date',
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                date: '$_id.date',
                totalIncome: 1,
                totalExpense: 1,
                total: { $subtract: ['$totalIncome', '$totalExpense'] },
                transactions: 1,
              },
            },
            {
              $sort: { date: -1 },
            },
          ],
        },
      },

      // ================= FORMAT SUMMARY =================
      {
        $project: {
          calendar: 1,
          daily: 1,

          totalIncome: {
            $ifNull: [
              {
                $arrayElemAt: [
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: '$summary',
                          as: 's',
                          cond: {
                            $eq: ['$$s._id', TransactionType.INCOME],
                          },
                        },
                      },
                      as: 'i',
                      in: '$$i.total',
                    },
                  },
                  0,
                ],
              },
              0,
            ],
          },

          totalExpense: {
            $ifNull: [
              {
                $arrayElemAt: [
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: '$summary',
                          as: 's',
                          cond: {
                            $eq: ['$$s._id', TransactionType.EXPENSE],
                          },
                        },
                      },
                      as: 'i',
                      in: '$$i.total',
                    },
                  },
                  0,
                ],
              },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          balance: {
            $subtract: ['$totalIncome', '$totalExpense'],
          },
        },
      },
    ]);
  }
  async getCategoryStats(userId: string) {
    return this.transactionModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          type: TransactionType.EXPENSE,
        },
      },
      {
        $group: {
          _id: '$categoryId',
          total: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'categories', // tên collection
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryName: '$category.name',
          total: 1,
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);
  }
}
