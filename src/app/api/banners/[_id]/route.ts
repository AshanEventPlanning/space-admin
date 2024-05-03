import {EditBannerDTO} from "@/server/application/common/dtos/banner";

export const dynamic = "force-dynamic";

import lifeCycleErrorHandlingMiddleware from "@/server/api/middleware/lifecycle-error-handling-middleware";
import {EditCategoryDTO} from "@/server/application/common/dtos/category";
import ValidationError from "@/server/application/common/errors/validation-error";
import {log} from "@/server/application/common/services/logging";
import updateBannerCommandHandler from "@/server/application/features/banner/commands/update-banner-command-handler";
import getBannerQueryHandler from "@/server/application/features/banner/queries/get-banner-query-handler";
import deleteCategoryCommandHandler
    from "@/server/application/features/category/commands/delete-category-command-handler";
import updateCategoryCommandHandler
    from "@/server/application/features/category/commands/update-category-command-handler";
import getCategoryQueryHandler from "@/server/application/features/category/queries/get-category-query-handler";
import {NextRequest} from "next/server";

export async function DELETE(
    request: NextRequest,
    {params: {_id}}: { params: { _id: string } }
) {
    try {
        await deleteCategoryCommandHandler({_id});

        return new Response(null, {
            status: 204,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        log("SEVERE", error);
        return lifeCycleErrorHandlingMiddleware(error as Error);
    }
}

export async function GET(
    request: NextRequest,
    {params: {_id}}: { params: { _id: string } }
) {
    try {
        const banner = await getBannerQueryHandler({_id});

        return new Response(JSON.stringify(banner), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        log("SEVERE", error);
        return lifeCycleErrorHandlingMiddleware(error as Error);
    }
}

export async function PATCH(
    request: NextRequest,
    {params: {_id}}: { params: { _id: string } }
) {
    try {
        const body = await request.json();
        const requestBody = EditBannerDTO.safeParse(body);

        if (!requestBody.success) {
            throw new ValidationError();
        }

        await updateBannerCommandHandler({_id, ...requestBody.data});

        return new Response(null, {
            status: 204,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        log("SEVERE", error);
        return lifeCycleErrorHandlingMiddleware(error as Error);
    }
}