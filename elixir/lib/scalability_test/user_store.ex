defmodule ScalabilityTest.UserStore do
  @moduledoc false

  def init_store() do
    :ets.new(:user_info_store, [:set, :protected, :named_table])
    :ets.new(:user_password_store, [:set, :protected, :named_table])
  end

  def set_user_info(user_name, user_info) do
    :ets.insert(:user_info_store, {user_name, user_info})
  end

  def get_user_info(user_name) do
    :ets.lookup(:user_info_store, user_name)
  end

  def set_user_password(user_name, password_hash) do
    :ets.insert(:user_password_store, {user_name, password_hash})
  end

  def get_user_password(user_name) do
    :ets.lookup(:user_password_store, user_name)
  end

end
