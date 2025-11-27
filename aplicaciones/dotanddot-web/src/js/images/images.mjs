import API from '../env.js';
import {get, postImage} from "../http";

export async function saveUserImage(file) {
    try {
        const formData = new FormData();
        const originalName = file.name || '';
        const hasExt = originalName.includes('.');
        const ext = hasExt ? originalName.split('.').pop() : (file.type ? file.type.split('/').pop() : 'jpg');
        const filename = `profilepic${ext ? `.${ext}` : ''}`;
        formData.append('file', file, filename);

        const response = await postImage(API.IMAGE.SAVE, formData);

        if (!response.ok) {
            throw new Error('Image upload failed');
        }

        return response.json();
    } catch (error) {
        console.error('saveUserImage error:', error);
        return false;
    }
}

export async function getProfilePic() {
    try {
        const response = await get(API.IMAGE.GET('profilepic'));

        if (!response.ok) {
            throw new Error('Image fetch failed');
        }
        const data = await response.json();
        if (data.status === 200) {
            const image = await data.message();
            return image;
        } else {
            throw new Error('Failed to get profile picture');
        }
    } catch (error) {
        console.error('Error getting profile picture:', error);
        return false;
    }
}
