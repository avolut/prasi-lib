import { FC, useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

export const QrReader: FC<{ url: string }> = ({ url }) => {
    const scanner = useRef<QrScanner>();
    const videoEl = useRef<HTMLVideoElement>(null);
    const qrBoxEl = useRef<HTMLDivElement>(null);
    const [qrOn, setQrOn] = useState<boolean>(true);
    const [scannedResult, setScannedResult] = useState<string | undefined>("");
    const [hasScanned, setHasScanned] = useState<boolean>(false);


    // Success
    const onScanSuccess = (result: QrScanner.ScanResult) => {
        // console.log(result);
        // navigate("/hasil/scan");
        // setScannedResult(result?.data);
        if (!hasScanned) {
            console.log(result);
            setScannedResult(result?.data);
            setHasScanned(true);
            scanner.current?.stop();

            setTimeout(() => {
                // console.log("Mencoba trigger hasil scan");
                // navigate(`/hasil/scan?id_asset=${result?.data}`);
                navigate(url + result?.data);
            }, 1000);
        }
    };

    // Fail
    const onScanFail = (err: string | Error) => {
        console.log(err);
    };

    useEffect(() => {
        if (videoEl?.current && !scanner.current) {
            scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
                onDecodeError: onScanFail,
                preferredCamera: "environment",
                highlightScanRegion: true,
                highlightCodeOutline: true,
                overlay: qrBoxEl?.current || undefined,
            });

            scanner?.current
                ?.start()
                .then(() => setQrOn(true))
                .catch((err) => {
                    if (err) setQrOn(false);
                });
        }

        return () => {
            if (!videoEl?.current) {
                scanner?.current?.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (!qrOn)
            alert(
                "Kamera tidak bisa diakses. Tolong beri izin untuk akses kamera dan silahkan reload."
            );
    }, [qrOn]);

    return (
        <div className="qr-reader">
            <video ref={videoEl}></video>
            <div ref={qrBoxEl} className="qr-box">

            </div>
            {scannedResult && (
                <p
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 99999,
                        color: "white",
                    }}
                >
                    Scanned Result: {scannedResult}
                </p>
            )}
        </div>
    );
};
