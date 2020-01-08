defmodule ScalabilityTest.UserStore do
  use GenServer

  def start_link(_arg) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(args) do
    :ets.new(:user_info_store, [:set, :protected, :named_table])
    :ets.new(:user_password_store, [:set, :protected, :named_table])
    {:ok, args}
  end

  def handle_call({:set_user_info, user_name, user_info}, _from, state) do
    true = :ets.insert(:user_info_store, {user_name, user_info})
    {:reply, :ok, state}
  end

  def handle_call({:set_user_password, user_name, password_hash}, _from, state) do
    true = :ets.insert(:user_password_store, {user_name, password_hash})
    {:reply, :ok, state}
  end

  def set_user_info(user_name, user_info) do
    GenServer.call(__MODULE__, {:set_user_info, user_name, user_info})
  end

  def get_user_info(user_name) do
    [{_, user_info}] = :ets.lookup(:user_info_store, user_name)
    user_info
  end

  def set_user_password(user_name, password_hash) do
    GenServer.call(__MODULE__, {:set_user_password, user_name, password_hash})
  end

  def get_user_password(user_name) do
    [{_, password_hash}] = :ets.lookup(:user_password_store, user_name)
    password_hash
  end

end
