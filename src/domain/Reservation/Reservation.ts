import { DomainError, ReservationAlreadyCanceledError, ReservationAlreadyConfirmedError } from "../Error/errors";

type ReservationId = string;
type UserId = string;
type ResourceId = string;
type SlotId = string;

interface SlotProps {
    id: SlotId;
    startsAt: Date;
    endsAt: Date;
}

export interface ReservationDto {
    id: ReservationId;
    userId: UserId;
    resourceId: ResourceId;
    slots: SlotProps[];
    status: "created" | "confirmed" | "canceled";
    createdAt: Date;
    updatedAt: Date;
}

export class Reservation {
    private props: ReservationDto;

    private constructor(props: ReservationDto) {
        this.props = props;
    }

    static create(
        id: ReservationId,
        userId: UserId,
        resourceId: ResourceId,
        slots: SlotProps[]
    ): Reservation {
        return new Reservation({
            id,
            userId,
            resourceId,
            slots,
            status: "created",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    confirm(): void {
        if (this.props.status === "canceled") {
            throw new DomainError(
                `Cannot confirm a canceled reservation ${this.props.id}`
            );
        }
        if (this.props.status === "confirmed") {
            throw new ReservationAlreadyConfirmedError(this.props.id);
        }

        this.props.status = "confirmed";
        this.props.updatedAt = new Date();
    }

    cancel(): void {
        if (this.props.status === "canceled") {
            throw new ReservationAlreadyCanceledError(this.props.id);
        }

        this.props.status = "canceled";
        this.props.updatedAt = new Date();
    }

    toDto(): ReservationDto {
        return {
            id: this.props.id,
            userId: this.props.userId,
            resourceId: this.props.resourceId,
            slots: this.props.slots,
            status: this.props.status,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}