import QRCode from 'qrcode';



const generateQRCode = async (qrCodeText) => {
	const options = {
		errorCorrectionLevel: 'M',
		type: 'image/png',
		margin: 1
	};

	const qrCodeBuffer = await QRCode.toBuffer(qrCodeText, options);
	return qrCodeBuffer;
};

export default generateQRCode;