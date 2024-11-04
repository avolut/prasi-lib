import { FC, useEffect, useRef, useState } from "react";
import { default as ScanQr } from "qr-scanner";
import { QrReaderType } from "./typings";

export const QrScanner: FC<{ onSuccess: (result: any) => {} }> = ({ onSuccess }) => {
    const w = window as any;
    const scanner = useRef<ScanQr>();
    const videoEl = useRef<HTMLVideoElement>(null);
    const qrBoxEl = useRef<HTMLDivElement>(null);
    const [qrOn, setQrOn] = useState<boolean>(true);
    const [scannedResult, setScannedResult] = useState<string | undefined>("");
    const [hasScanned, setHasScanned] = useState<boolean>(false);
    const onScanSuccess = (result: ScanQr.ScanResult) => {
        if (!hasScanned) {
            console.log(result);
            setScannedResult(result?.data);
            setHasScanned(true);
            scanner.current?.stop();

            setTimeout(() => {
                onSuccess(result?.data);
            }, 1000);
        }
    };
    const onScanFail = (err: string | Error) => {
        console.log("failed", err);
    };
    const openCameraScanner = () => {
        if (w.AndroidBridge && w.AndroidBridge.openCameraScanner) {
            w.AndroidBridge.openCameraScanner();
        } else {
            console.error("AndroidBridge or openCameraScanner function is not available.");
        }
    };
    if (w.AndroidBridge && w.AndroidBridge.openCameraScanner) {
        useEffect(() => {
            openCameraScanner();
        }, []);

        useEffect(() => {
            w.onScannerResult = (scannedData: string) => {
                console.log('Scanned Data:', scannedData);
                onSuccess(scannedData);
            };
        }, []);
        return (
            <div>
                <h1>QR/Barcode Scanner</h1>
            </div>
        );
    } else {
        console.log("Bridge not found");
        useEffect(() => {
            if (videoEl?.current && !scanner.current) {
                scanner.current = new ScanQr(videoEl?.current, onScanSuccess, {
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
    }
};