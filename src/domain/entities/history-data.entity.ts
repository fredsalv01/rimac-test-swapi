export class HistoryData {
    constructor(
        public readonly id: string,
        public readonly uuid: string,
        public mergeData: string,
        public readonly createdAt: string
    ){}


    toPrimitives() {
        return {
            id: this.id,
            uuid: this.uuid,
            mergeData: this.mergeData,
            createdAt: this.createdAt
        }
    }

    static fromPrimitives(data: {
        id: string,
        uuid: string,
        mergeData: string,
        createdAt: string
    }): HistoryData {
        return new HistoryData(
            data.id,
            data.uuid,
            data.mergeData,
            data.createdAt
        )
    }
}