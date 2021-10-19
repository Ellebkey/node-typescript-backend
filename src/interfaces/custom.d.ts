declare namespace Express {
  export interface Request {
    expense: import('../interfaces/expense.interfaces').ExpenseReq;
    account: import('../interfaces/account.interfaces').AccountReq;
    article: import('../interfaces/article.interfaces').ArticleReq;
    income: import('../interfaces/income.interfaces').IncomeReq;
    user: import('../interfaces/user.interfaces').UserPayload;
    userClient: import('../interfaces/user.interfaces').UserPayload;
  }
}
