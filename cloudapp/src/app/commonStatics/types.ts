export interface TBookRequest {
    user_identifier: string,
    show_user_barcode?: string,
    books_descriptions: string
}
export function isTBookRequest(obj: any): obj is TBookRequest {
    return  'user_identifier' in obj;
}

export type TConfig = {
                items: Array<TItem>,
                is_default: boolean,
                circulation_desks: Array<any>,
                user_identifier_types?: Array<any>
            }
export type TItem = {
                item_id: number,
                name: string,
                comment: string,
                circulation_desk: string,
                library_code: string,
                link: string,
                icon: string,
                idents?: TIdents,
                show_primary_id: boolean,
                show_barcode: boolean,
                show_fullname: boolean,
                bottom_fullname: boolean
            }

export type TIdents = {
                order: Array<any>,
                check: Array<boolean>
            }