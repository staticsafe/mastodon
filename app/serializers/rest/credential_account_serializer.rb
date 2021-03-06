# frozen_string_literal: true

class REST::CredentialAccountSerializer < REST::AccountSerializer
  attributes :source

  def source
    user = object.user
    {
      privacy: user.setting_default_privacy,
      note: object.note,
    }
  end
end
