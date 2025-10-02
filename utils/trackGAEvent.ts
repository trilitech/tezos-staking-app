export enum GAAction {
  BUTTON_CLICK = 'staking_button_click',
  CONNECT_SUCCESS = 'connect_success',
  CONNECT_ERROR = 'connect_error'
}

export enum GACategory {
  WALLET_BEGIN = 'wallet_begin',
  WALLET_SUCCESS = 'wallet_success',
  WALLET_ERROR = 'wallet_error',

  CHOOSE_BAKER_START = 'choose_baker_start',
  CONTINUE_DELEGATION = 'continue_delegation',
  CHOOSE_BAKER_SUCCESS = 'choose_baker_success',
  CHOOSE_BAKER_CLOSED = 'choose_baker_closed',
  START_DELEGATE_BEGIN = 'start_delegate_begin',
  START_DELEGATE_END = 'start_delegate_end',
  CONTINUE_AFTER_DELEGATION = 'continue_after_delegation',

  CHOOSE_CHANGE_BAKER = 'choose_change_baker',
  CHANGE_BAKER_SUCCESS = 'change_baker_success',

  END_DELEGATE_BEGIN = 'end_delegate_begin',
  END_DELEGATE_END = 'end_delegate_end',

  CHOOSE_STAKE = 'choose_stake',
  ACCEPT_DISCLAIMER = 'accept_disclaimer',
  CONTINUE_STAKE = 'continue_stake',
  INPUT_AMOUNT = 'input_amount',
  START_STAKE_BEGIN = 'start_stake_begin',
  START_STAKE_END = 'start_stake_end',
  CONTINUE_AFTER_STAKE = 'continue_after_stake',

  CHOOSE_UNSTAKE = 'choose_unstake',
  CHOOSE_I_UNDERSTAND = 'choose_i_understand',
  END_STAKE_BEGIN = 'end_stake_begin',
  END_STAKE_END = 'end_stake_end',

  FINALIZE_BEGIN = 'finalize_begin',
  FINALIZE_END = 'finalize_end'
}

export const trackGAEvent = (action: GAAction, category: GACategory) => {
  ;(window as any)?.gtag('event', action, {
    event_category: category
  })
}
