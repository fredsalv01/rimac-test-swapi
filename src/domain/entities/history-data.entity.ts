export class HistoryData {
    constructor(
        public readonly id: string,
        public mergeData: string,
        public readonly createdAt: string
    ){}


    toPrimitives() {
        return {
            id: this.id,
            mergeData: this.mergeData,
            createdAt: this.createdAt
        }
    }

    static fromPrimitives(data: {
        id: string,
        mergeData: string,
        createdAt: string
    }): HistoryData {
        return new HistoryData(
            data.id,
            data.mergeData,
            data.createdAt
        )
    }
}