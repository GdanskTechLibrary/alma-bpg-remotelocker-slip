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

//    let getted_faru_els = user_datas.user_identifier?.filter(ui => ui.id_type.value === 'FARU_ELS')[0]?.value;
//    if (getted_faru_els) {
//        return [getted_faru_els, true];
//    }
//    let other_id_1 = user_datas.user_identifier?.filter(ui => ui.id_type.value === 'OTHER_ID_1')[0]?.value;
//    if (other_id_1) {
//        return [other_id_1, true];
//    }
//
//    let getted_faru_barcode = user_datas.user_identifier?.filter(ui => ui.id_type.value === 'FARU_BARCODE')[0]?.value;
//    if (getted_faru_barcode) {
//        return [getted_faru_barcode, true];
//    }
//    
//    let other_id_2 = user_datas.user_identifier?.filter(ui => ui.id_type.value === 'OTHER_ID_2')[0]?.value;
//    if (other_id_2) {
//        return [other_id_2, true];
//    }
    
//    if (user_datas.user_identifier.filter(ui => ui.id_type?.value === 'BARCODE').length === 0) {
//        return ['brak identyfikatora dla książkomatu', false];
//    }
//    if (user_datas?.record_type.value === "STAFF") {
//        return [user_datas.primary_id + ' (pracownik BPG)', false];
//    }