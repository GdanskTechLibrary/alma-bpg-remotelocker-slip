export function _send_slip_to_printer():void {

        var section_to_print = document.getElementById('print_area');
        section_to_print.querySelectorAll<HTMLElement>('.cutting').forEach(function(el) {
            el.style.display = 'none';
         });
        section_to_print.querySelectorAll<HTMLElement>('.hring').forEach(function(el) {
            el.style.display = 'block';
         });
         var window_to_print = window.open('', '_blank', 'left=0,top=0,toolbar=0,scrollbars=0,status=0');
        window_to_print.document.write(section_to_print.innerHTML);
        window_to_print.document.close();
        window_to_print.focus();
        window_to_print.print();
        window_to_print.close();
    }
export function _send_slip_to_printer_with_cutting():void {

        var section_to_print = document.getElementById('print_area');
        section_to_print.querySelectorAll<HTMLElement>('.cutting').forEach(function(el) {
            el.style.display = 'block';
         });
        section_to_print.querySelectorAll<HTMLElement>('.hring').forEach(function(el) {
            el.style.display = 'none';
         });
        var window_to_print = window.open('', '_blank', 'left=0,top=0,toolbar=0,scrollbars=0,status=0');
        window_to_print.document.write(section_to_print.innerHTML);
        window_to_print.document.close();
        window_to_print.focus();
        window_to_print.print();
        window_to_print.close();
        section_to_print.querySelectorAll<HTMLElement>('.hring').forEach(function(el) {
            el.style.display = 'block';
         });
    }
