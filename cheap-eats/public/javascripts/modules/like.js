import axios from 'axios';
import { $ } from './bling';

function getLikes(e) {
    e.preventDefault();
    axios.post(this.action)
        .then(res => {
            const isLiked = this.like.classList.toggle('heart__button--hearted');
            $('.heart-count').textContent = res.data.likes.length;
            if (isLiked) {
                this.like.classList.add('heart__button--float');
                setTimeout(() => this.like.classList.remove('heart__button--float'), 1500);
            }
        });
};

export default getLikes;