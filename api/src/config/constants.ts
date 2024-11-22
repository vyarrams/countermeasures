export const CONSTANTS = {
    default_user_image: 'https://fmg-media.s3.amazonaws.com/cofinds/defaults/user.png',
    default_cover_image: 'https://fmg-media.s3.amazonaws.com/cofinds/defaults/cover-1.jpg',

    jwt_user_secret: 'fmg_astc_user',
    jwt_admin_secret: 'fmg_astc_admin',
    password_reset_base_url: 'https://cofinds.com/reset-password',

    free_plan_pitch_limit: 2,

    s3_bucket_name: 'fmg-media',

    SEND_IN_BLUE_KEY: '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',

    http_codes: {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        REJECTED: 418,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        TIME_OUT: 408,
        CONFLICT: 409,
        INTERNAL_ERROR: 500,
        BAD_GATEWAY: 502,
        NOT_AVAILABLE: 503,
        SUSPICIOUS_ACTIVITY: 475
    },
}



// const old_posts = posts_json_file;
        // const stages = stages_json_file;
        // // old_posts.forEach((post: any) => {
        // //     const new_pitch = new pitch_model({
        // //         _id: post._id.$oid,
        // //         pitch: post.pitch,
        // //         roles: post.roles,
        // //         tags: post.tags,
        // //         stage: post.stage ? stages.filter((stage: any) => stage._id.$oid === post.stage.$oid) ? stages.filter((stage: any) => stage._id.$oid === post.stage.$oid)[0].name.trim() : 'Other' : 'Other',
        // //         user_id: post.user_id.$oid,
        // //         likes: post.likes.map((like: any) => like.$oid),
        // //         comments: [],
        // //         saves: [],
        // //         isActive: true,
        // //     });
        // //     new_pitch.save().then((res: any) => {
        // //         console.log('Saved');
        // //     }).catch((err: any) => {
        // //         console.log('Error', err);
        // //     });
        // // });