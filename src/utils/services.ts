export function arrayItemMove<T>(array: any[], fromIndex: number, toIndex: number): T[] {
    if (toIndex < 0) {
        toIndex = 0;
    } else if (toIndex > array.length) {
        toIndex = array.length;
    }

    const newArray = [...array];
    const item = newArray.splice(fromIndex, 1)[0];
    newArray.splice(toIndex, 0, item);
    return newArray;
}

export function isddMMyyyy(value: string) {
    // định dạng ngày dd/MM/yyyy
    const dateFormat = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/;
    return dateFormat.test(value);
}

export function getddMMyyyy(dateString: string): string {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0"); // Lấy ngày, nếu là số một chữ số thì thêm '0' phía trước
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Lấy tháng, phải cộng thêm 1 vì getMonth trả về số tháng từ 0-11
    const year = date.getFullYear().toString(); // Lấy năm

    return `${day}/${month}/${year}`; // Trả về chuỗi định dạng 'dd/MM/yyyy'
}

export function getddMMyyyyHHmmss(dateString: string): string {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0"); // Lấy ngày, nếu là số một chữ số thì thêm '0' phía trước
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Lấy tháng, phải cộng thêm 1 vì getMonth trả về số tháng từ 0-11
    const year = date.getFullYear().toString(); // Lấy năm

    const hours = date.getHours().toString().padStart(2, "0"); // Lấy giờ
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Lấy phút
    const seconds = date.getSeconds().toString().padStart(2, "0"); // Lấy giây

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`; // Trả về chuỗi định dạng 'dd/MM/yyyy HH:mm:ss'
}
