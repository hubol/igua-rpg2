export class JobProgress {
    private _totalJobsCount = 0;
    private _completedJobsCount = 0;
    private _completed = false;

    increaseTotalJobsCount(amount: number) {
        this._totalJobsCount += amount;
    }

    increaseCompletedJobsCount(amount: number) {
        this._completedJobsCount += amount;
    }

    complete() {
        this._completed = true;
    }

    get completed() {
        return this._completed;
    }

    get percentage() {
        if (this._completed) {
            return 1;
        }
        if (this._totalJobsCount === 0) {
            return 0;
        }
        return Math.min(0.9, this._completedJobsCount / this._totalJobsCount);
    }
}
