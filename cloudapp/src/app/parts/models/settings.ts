interface OrderType {
    identify_type: string;
    order: number,
    checked: boolean,
}
interface OrderedIdentType {
  [ident: string]: [OrderType];
};

export class Settings {

  idents_ordered: any = [
  ];
    idents_checked = 
    [
        false, false, false, false, false, false, false, 
        false, false, false, false, false, false, false,
        false, false, false, false, false, false, false
    ];
}