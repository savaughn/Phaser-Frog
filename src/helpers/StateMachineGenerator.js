import StateMachine, * as States from './StateMachine.hero';

export default function(sprite, type) {
    if (type === 'hero') {
        return new StateMachine('idle', {
            idle: new States.IdleState(),
            move: new States.MoveState(),
            crouch: new States.CrouchState(),
            jump: new States.JumpState(),
            doubleJump: new States.DoubleJumpState(),
            slide: new States.SlideState({ inputAxisValue: sprite.leftAxis?.value }),
            land: new States.LandingState()
        }, sprite);
    }
}