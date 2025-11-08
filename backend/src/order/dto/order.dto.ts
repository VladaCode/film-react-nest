export class CreateOrderDto {
  filmId: string;
  sessionId: string;
  seats: Array<{
    row: number;
    seat: number;
  }>;
}
