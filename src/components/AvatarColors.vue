<template>
    <div class="card mcard">
        <h6 class="card-header">
            <i class="fad fa-palette"></i> Body Colors
        </h6>
        <div class="card-body text-center" id="#body-parts">
            <div style="margin-bottom: 5px"><button id="head" class="avatarAction bodypart bp1x1"
                    style="background-color: #ffece1;"></button></div>
            <div style="margin-bottom: 5px"><button id="rightArm" class="avatarAction bodypart bp1x2"
                    style="background-color: #ffece1; margin-right: 5px;"></button><button id="torso"
                    class="avatarAction bodypart bp2x2" style="background-color: #472d2d;"></button><button
                    class="avatarAction bodypart bp1x2" id="leftArm"
                    style="background-color: #ffece1; margin-left: 5px;"></button></div>
            <div><button class="avatarAction bodypart bp1x2" id="rightLeg"
                    style="background-color: #ffece1; margin-right: 5px; padding-right: 18px;"></button><button id="leftLeg"
                    class="avatarAction bodypart bp1x2" style="background-color: #ffece1; padding-right: 18px;"></button>
            </div>
        </div>
    </div>
</template>