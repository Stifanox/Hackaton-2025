type Rectangle = {
    x: number;
    y: number;
    selected: boolean;

    center: {
        x: number;
        y: number;
    };

    relativeToCenter: {
        x: number;
        y: number;
    };

    gps: {
        lat: number;
        lon: number;
    };
};

export type { Rectangle };
