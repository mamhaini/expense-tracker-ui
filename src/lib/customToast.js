import {toast} from '@zerodevx/svelte-toast';

export const success = m => toast.push(m, {
    theme: {
        '--toastBarBackground': 'green'
    },
    duration: 2000
});

export const warning = m => toast.push(m, {
    theme: {
        '--toastBarBackground': 'darkorange'
    },
    duration: 3000
});

export const failure = m => toast.push(m, {
    theme: {
        '--toastBarBackground': 'darkred'
    },
    duration: 3000
});