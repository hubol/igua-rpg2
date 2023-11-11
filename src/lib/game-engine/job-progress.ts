export class JobProgress {
    totalJobsCount = 0;
    completedJobsCount = 0;
    completed = false;

    get percentage() {
        if (this.completed)
            return 1;
        if (this.totalJobsCount === 0)
            return 0;
        return Math.min(0.9, this.completedJobsCount / this.totalJobsCount);
    }
}
