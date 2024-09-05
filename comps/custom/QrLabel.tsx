import { FC } from "react";
import QRCode from 'react-qr-code';

export const QrLabel: FC<{
    value: string,
    bgcolor: string,
    fgcolor: string,
    size: number
}> = ({ value, bgcolor, fgcolor, size }) => {
    return (
        <div>
            <QRCode value={value} size={size}
                bgColor={bgcolor}
                fgColor={fgcolor}
                level={"L"} />
        </div>
    )
}