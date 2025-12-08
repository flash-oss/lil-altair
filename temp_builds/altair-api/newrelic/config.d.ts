export declare const config: {
    app_name: (string | undefined)[];
    license_key: string | undefined;
    distributed_tracing: {
        enabled: boolean;
    };
    logging: {
        level: string;
    };
    application_logging: {
        forwarding: {
            enabled: boolean;
        };
    };
    error_collector: {
        expected_status_codes: number[];
    };
    allow_all_headers: boolean;
    attributes: {
        exclude: string[];
    };
};
//# sourceMappingURL=config.d.ts.map