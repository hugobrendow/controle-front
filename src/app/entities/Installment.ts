export class Installment {
    id: number = null;
    value: number = null;
    paidValue: number = null;
    barcode: String = null;
    status: StatusInstallment = null;
    statusCode: null;
    dueDate: String = null;
    paymentDate: String = null;
}

enum StatusInstallment {
    PAID, PENDING, LATE
}