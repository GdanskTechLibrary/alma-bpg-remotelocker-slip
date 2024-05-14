export function __passed_remotelocker(user_requests: Array<any>) {
    return user_requests
        .filter(ur => ur.pickup_location_circulation_desk === "cd_remotelocker-requ")
        .filter(ur => ur.task_name === "Transit Item")
        ;
}

export function __choice_user_barcode(user_datas:any, idents_ordered: Array<any>, idents_checked: Array<any>): [string, boolean, string] 
  {
    let id_to_print = '';
    let i = 0;
    for (let ident of idents_ordered) {
        if(idents_checked[i]) {
            if (___choice_identifier(user_datas, ident.ident.code)) {
                return [___choice_identifier(user_datas, ident.ident.code), true, ident.ident.description];
            }
        }
        i++;
    }
    return [user_datas.primary_id, true, 'ID'];//.user_identifier.filter(ui => ui.id_type?.value === 'PRIMARY_ID')[0]?.value;
  }
  function ___choice_identifier(user_datas:any, identifier_type:string): any {
    return user_datas.user_identifier?.filter(ui => ui.id_type.value === identifier_type)[0]?.value;
  }

