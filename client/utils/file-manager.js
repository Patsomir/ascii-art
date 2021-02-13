export class FileManager {
    input;

    onSelect;

    constructor() {
        this.input = document.createElement('input');
        this.input.type = 'file';

        this.input.addEventListener('change', event => {
            if(event.target.files.length > 0) {
                this.onSelect(event.target.files[0]);
            }
            this.input.value = null;
        });
    }

    openPrompt() {
        this.input.click();
    }
}