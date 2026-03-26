import type { APIGatewayProxyEvent } from "aws-lambda";
import { Review } from "../../domain/Review/Review";
import { log } from "../../shared/logger";

export const handler = async (evt: APIGatewayProxyEvent) => {
    const review = Review.make("1");

    log("Review created: " + JSON.stringify(review.toDTO()));

    return {
        statusCode: 200,
        body: JSON.stringify(review.toDTO()),
    };
};