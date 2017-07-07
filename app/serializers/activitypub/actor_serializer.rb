# frozen_string_literal: true

class ActivityPub::ActorSerializer < ActiveModel::Serializer
  include RoutingHelper

  attributes :id, :type, :following, :followers,
             :inbox, :outbox, :preferredUsername,
             :name, :summary, :icon, :image

  def id
    account_url(object)
  end

  def type
    'Person'
  end

  def following
    account_following_index_url(object)
  end

  def followers
    account_followers_url(object)
  end

  def inbox
    nil
  end

  def outbox
    account_outbox_url(object)
  end

  def preferredUsername
    object.username
  end

  def name
    object.display_name
  end

  def summary
    Formatter.instance.simplified_format(object)
  end

  def icon
    full_asset_url(object.avatar.url(:original))
  end

  def image
    full_asset_url(object.header.url(:original))
  end
end