export interface Quest {
    location: {
        lat: number;
        long: number;
    };
    timestamp: string;
    next?: string;
}