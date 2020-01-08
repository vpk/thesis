defmodule ScalabilityTestWeb.LongPollController do
  use ScalabilityTestWeb, :controller

  def index(conn, _params) do
    Process.sleep(5000)
    text(conn, "OK")
  end
end
