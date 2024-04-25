// This file is intended to hold reusable functions (tools), like randomIDGenerator, etc.

export const randomIdGenerator = () => { // Creates a random string and concats a prefix if wanted.  Can reuse this throughout the website.
    const random = crypto.randomUUID();
    const time = Date.now();
    return `${time}` + `-` + `${random}`; // This ensures every random ID generated is sortable, based on Time.
}

export function copyToClipboard(button: HTMLButtonElement, text: any) {
    button.addEventListener('click', (e) => { 
        e.preventDefault(); 
        navigator.clipboard.writeText(text);
        console.log("Copied To Clipboard: ", text);
    });
};