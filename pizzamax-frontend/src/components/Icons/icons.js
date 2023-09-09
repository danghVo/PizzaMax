export const location = ({ className, height = '2rem', width = '1.5rem' }) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
        >
            <path d="M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z"></path>
        </svg>
    );
};

export const user = ({ className, height = '2rem', width = '1.7rem' }) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
        >
            <path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"></path>
        </svg>
    );
};

export const cart = ({ className, height = '2rem', width = '2rem' }) => {
    return (
        <svg className={className} width={width} height={height} viewBox="0 0 24 24">
            <path
                fill="#ffffff"
                d="M19.5,6.9c0-0.8-0.7-1.5-1.5-1.5h-2V3.9C15.9,1.8,14.2,0,12,0S8.2,1.8,8.2,3.9v1.6h-2c-0.8,0-1.5,0.6-1.5,1.5L3.3,22.3 C3.3,23.2,4,24,4.9,24h14.2c0.9,0,1.6-0.8,1.5-1.7L19.5,6.9z M9.4,3.9c0-1.5,1.2-2.7,2.7-2.7s2.7,1.2,2.7,2.7v1.6H9.4V3.9z M8.8,8.4 C8.2,8.4,7.8,8,7.8,7.5c0-0.6,0.4-0.9,0.9-0.9c0.5,0,0.9,0.4,0.9,0.9C9.7,8.1,9.3,8.4,8.8,8.4z M15.3,8.4c-0.6,0-0.9-0.4-0.9-0.9 c0-0.6,0.4-0.9,0.9-0.9s0.9,0.4,0.9,0.9C16.2,8.1,15.8,8.4,15.3,8.4z"
            ></path>
        </svg>
    );
};

export const close = ({ className, width = '2.8rem', height = '2.8rem' }) => {
    return (
        <svg className={className} width={width} height={height} focusable="false" viewBox="0 0 24 24">
            <path
                fill="#ffffff"
                d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            ></path>
        </svg>
    );
};

export const locationModal = ({ className, width = '1.8rem', height = '1.8rem' }) => {
    return (
        <svg className={className} width={width} height={height} focusable="false" viewBox="0 0 24 24">
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path>
        </svg>
    );
};

export const arrow = ({ className, width = '1rem', height = '0.5rem' }) => {
    return (
        <svg width={width} height={height} className={className} focusable="false" viewBox="0 0 24 24">
            <path fill="#0000008a" d="M7 10l5 5 5-5z"></path>
        </svg>
    );
};

export const valid = ({ className, width = '2.2rem', height = '2.2em' }) => {
    return (
        <svg className={className} focusable="false" width={width} height={height} viewBox="0 0 24 24">
            <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
        </svg>
    );
};

export const arrowRight = ({ className, width = '2rem', height = '2rem' }) => (
    <svg className={className} focusable="false" width={width} height={height} viewBox="0 0 24 24">
        <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
    </svg>
);

export const magnifying = ({ className, width = '2.8rem', height = '2.8rem' }) => {
    return (
        <svg
            opacity="0.8"
            width={width}
            height={height}
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z"
                fill="#24282b"
            ></path>
        </svg>
    );
};

export const heart = ({ className, width = '1.4rem', height = '1.4rem' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            className={className}
            viewBox="0 0 512 512"
        >
            <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z"></path>
        </svg>
    );
};

export const minus = ({ className, width = '2.4rem', height = '2.4rem' }) => {
    return (
        <svg className={className} width={width} height={height} focusable="false" viewBox="0 0 24 24">
            <path d="M19 13H5v-2h14v2z"></path>
        </svg>
    );
};

export const plus = ({ className, width = '2.4rem', height = '2.4rem' }) => {
    return (
        <svg className={className} width={width} height={height} focusable="false" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
        </svg>
    );
};

export const checkBuy = ({ className, width = '2.2rem', height = '2.2rem' }) => {
    return (
        <svg className={className} width={width} height={height} focusable="false" viewBox="0 0 24 24">
            <path d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"></path>
        </svg>
    );
};
