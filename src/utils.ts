// This file is intended to hold reusable functions (tools), like randomIDGenerator, etc.

export const randomIdGenerator = () => { // Creates a random string and concats a prefix if wanted.  Can reuse this throughout the website.
    const random = crypto.randomUUID();
    const time = Date.now();
    return `${time}` + `-` + `${random}`; // This ensures every random ID generated is sortable, based on Time.
}