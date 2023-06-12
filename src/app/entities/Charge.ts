import { Installment } from "./Installment";

export class Charge {
    id: number;
    invoice: String;
    provider: number;
    date: String;
    amountValue: number;
    liquidValue: number;
    installments: Installment[];
    complementInvoice: String;
    category: CategoryCharge;
}

class CategoryCharge {
    id: number;
}
