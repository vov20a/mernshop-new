import { useEffect } from 'react'
import { Rating } from '@mui/material';
import profilePng from '../Profile.png';
import { Button } from 'react-bootstrap';
import { useDeleteProductReviewMutation } from '../features/products/productsApiSlice';
import useAuth from '../hooks/useAuth';

interface ReviewCardProps {
    productId?: string,
    review:
    {
        _id?: string,
        user: string,
        name: string,
        rating: number,
        comment: string,
    },
}

const ReviewCard = ({ review, productId }: ReviewCardProps) => {

    const { id: userId } = useAuth();

    const [deleteRview,] = useDeleteProductReviewMutation()

    const options = {
        value: review.rating,
        readOnly: true,
        precision: 0.5,
    };

    const deleteReviewHandler = () => {
        deleteRview({ productId, reviewId: review._id });
    }
    // useEffect(() => {


    // }, [review]);

    return (
        <>
            <div className="reviewCard" style={{ textAlign: 'center', border: "1px solid #000", marginRight: '10px', padding: '10px' }}>
                <img width="200px" src={profilePng} alt="User" />
                <p>{review.name}</p>
                <Rating {...options} style={{ padding: '10px' }} />
                <span className="reviewCardComment">{review.comment}</span>
                {userId === review.user ?
                    <Button onClick={deleteReviewHandler} color="primary">
                        Delete Review
                    </Button> : <></>}
            </div>

        </>
    );
};

export default ReviewCard;