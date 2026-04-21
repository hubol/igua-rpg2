import { Integer } from "../../../lib/math/number-alias-types";
import { Rpg } from "../rpg";
import { RpgMicrocosm } from "../rpg-microcosm";

const consts = {
    kilobyte: 1_000,
    megabyte: 1_000_000,
    gigabyte: 1_000_000_000,
    movieBytes: 2_000_000_000,
    maxStoredBytes: 64_000_000_000,
};

export class MicrocosmDownloadData extends RpgMicrocosm<MicrocosmDownloadData.State> {
    constructor(private readonly _config: MicrocosmDownloadData.Config) {
        super();
    }

    get windEssenceCount() {
        return this._state.windEssenceCount;
    }

    get downloadedBytesPerTick() {
        if (this.windEssenceCount < 1) {
            return 0;
        }
        const value = 128 * Math.round(Math.pow(1.3, this.windEssenceCount)) + 256 * this.windEssenceCount;
        return Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER;
    }

    get isTerminalEnabled() {
        return this._state.isTerminalEnabled;
    }

    get shouldDisableTerminalByFbi() {
        return Rpg.inventory.keyItems.has("IllegalMovie", 200);
    }

    disableTerminalByFbi() {
        this._state.isTerminalEnabled = false;
    }

    addWindEssence(count: Integer) {
        this._state.windEssenceCount += count;
    }

    downloadData() {
        const ticks = Rpg.records.gameTicksPlayed - this._state.lastEvaluatedGameTickCount;
        if (ticks <= 0 || !this._state.isTerminalEnabled) {
            return;
        }

        this._state.downloadedData = Math.min(
            consts.maxStoredBytes,
            this._state.downloadedData + ticks * this.downloadedBytesPerTick,
        );
        this._state.lastEvaluatedGameTickCount = Rpg.records.gameTicksPlayed;
    }

    removeMovies() {
        const count = this.storedMoviesCount;
        this._state.downloadedData -= count * consts.movieBytes;
        return count;
    }

    get storedMoviesCount() {
        return Math.floor(this._state.downloadedData / consts.movieBytes);
    }

    get isAtCapacity() {
        return this._state.downloadedData >= consts.maxStoredBytes;
    }

    get remainingBytesForNextMovie() {
        return consts.movieBytes - (this._state.downloadedData % consts.movieBytes);
    }

    static viewBytes(bytes: number) {
        if (bytes === 0) {
            return "0B";
        }
        if (bytes < 1) {
            return "<1B";
        }
        if (bytes < consts.kilobyte) {
            return Math.round(bytes) + "B";
        }
        if (bytes < consts.megabyte) {
            return Math.round(bytes / consts.kilobyte) + "KB";
        }
        if (bytes < consts.gigabyte) {
            return Math.round(bytes / consts.megabyte) + "MB";
        }
        return (bytes / consts.gigabyte).toFixed(1) + "GB";
    }

    protected createState(): MicrocosmDownloadData.State {
        return {
            isTerminalEnabled: true,
            downloadedData: 0,
            lastEvaluatedGameTickCount: 0,
            windEssenceCount: 0,
        };
    }
}

namespace MicrocosmDownloadData {
    export interface State {
        isTerminalEnabled: boolean;
        downloadedData: Integer;
        lastEvaluatedGameTickCount: Integer;
        windEssenceCount: Integer;
    }

    export interface Config {
    }
}
