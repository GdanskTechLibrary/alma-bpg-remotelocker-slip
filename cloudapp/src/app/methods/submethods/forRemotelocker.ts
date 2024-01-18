export function __passed_remotelocker(user_requests: Array<any>) {
    return user_requests
        .filter(ur => ur.pickup_location_circulation_desk === "cd_remotelocker-requ")
        .filter(ur => ur.task_name === "Transit Item")
        ;
}

export function __choice_user_barcode(user_datas:any): [string, boolean] 
  {
    console.log(user_datas);
    let add_id_1 = user_datas.user_identifier.filter(ui => ui.id_type.value === 'FARU_ELS')[0]?.value;
    let add_id_2 = user_datas.user_identifier.filter(ui => ui.id_type.value === 'PG_INDEX_NO')[0]?.value;
    if (add_id_2) {
        if (user_datas.note_type.filter(nt => nt.note_text?.value === "BARCODE").length !== 0
            && user_datas.note_type.filter(nt => nt.note_text === "mLegitymacja").length !== 0) {
                return [add_id_2, true];
        }
    } else {
        if (add_id_1) {
            return [add_id_1, true];
        }
    }
    
//    if (user_datas.user_identifier.filter(ui => ui.id_type?.value === 'BARCODE').length === 0) {
//        return ['brak identyfikatora dla książkomatu', false];
//    }
    if (user_datas?.record_type.value === "STAFF") {
        return [user_datas.primary_id + ' (pracownik BPG)', false];
    }
    return [user_datas.primary_id, true];//.user_identifier.filter(ui => ui.id_type?.value === 'PRIMARY_ID')[0]?.value;
  }
