export function __passed_rental(user_requests: Array<any>) {
 //        .filter(ur => ur.task_name === "Hold Shelf Request Slip Letter")//Transit Item")
    return user_requests
        .filter(ur => ur.pickup_location_circulation_desk === "cd_lending_request")
        .filter(ur => ur.task_name === "Transit Item");
}
export function __extract_user_name_description(user_datas:any): string 
{
  return user_datas.full_name;// + (user_datas?.external_id !== "")?'poza PG':'';
}