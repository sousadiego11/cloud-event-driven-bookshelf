import { BookDemand } from "../../../domain/Book/BookDemand";
import { DomainError } from "../../../domain/Error/errors";
import { Notification } from "../../../domain/Notification/Notification";
import type { LoanDTO } from "../dtos/LoanDto";
import type { ILoanRepository } from "../repositories";
import type { Usecase } from "../../Shared/Usecase";
import type { IInventoryRepository } from "../../Inventory/repositories";
import type { NotificationDTO } from "../../Notification/dtos/NotificationDto";
import { NotificationService } from "../../Notification/services";

export class AnalyzeBookDemandUsecase
    implements Usecase<LoanDTO, NotificationDTO | null> {

    constructor(
        private readonly loanRepository: ILoanRepository,
        private readonly inventoryRepository: IInventoryRepository,
        private readonly notificationService: NotificationService
    ) { }

    async handle(loan: LoanDTO): Promise<NotificationDTO | null> {
        const [loansInPeriod, inventory] = await Promise.all([
            this.loanRepository.findByBookIdInPeriod(loan.BookId, BookDemand.ANALYSIS_PERIOD_DAYS),
            this.inventoryRepository.findByBookId(loan.BookId),
        ]);

        if (!inventory) {
            throw new DomainError(`Inventory not found for book ${loan.BookId}`);
        }

        const demand = new BookDemand(loansInPeriod.length, inventory.Copies);
        if (!demand.isInHighDemand()) return null;

        const notification = Notification.forHighBookDemand(
            loan.BookId,
            loansInPeriod.length,
            BookDemand.ANALYSIS_PERIOD_DAYS,
            inventory.Copies,
            demand.ratio
        );

        return this.notificationService.saveIfNotExists(notification);
    }
}
