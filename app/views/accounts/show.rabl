object @account

node(:'@context') { 'https://www.w3.org/ns/activitystreams' }
node(:id) { |account| account_url(account) }
node(:type) { 'Person' }
node(:following) { |account| account_following_index_url(account) }
node(:followers) { |account| account_followers_url(account) }
node(:inbox) { nil }
node(:outbox) { |account| account_outbox_url(account) }
node(:preferredUsername, &:username)
node(:name, if: :display_name?, &:display_name)
node(:summary, if: :note?) { |account| Formatter.instance.simplified_format(account) }
node(:icon, if: :avatar?) { |account| full_asset_url(account.avatar.url(:original)) }
node(:image, if: :header?) { |account| full_asset_url(account.header.url(:original)) }