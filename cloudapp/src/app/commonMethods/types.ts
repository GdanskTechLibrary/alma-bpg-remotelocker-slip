export interface TBookRequest {
    user_identifier: string,
    show_user_barcode?: string,
    books_descriptions: string
}
export function isTBookRequest(obj: any): obj is TBookRequest {
    return  'user_identifier' in obj;
}

export type TConfig = {
                idents_ordered: Array<any>,
                idents_checked: Array<boolean>
            }