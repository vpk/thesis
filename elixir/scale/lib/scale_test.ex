defmodule ScaleTest do
  use Application

  def sleeper() do
    receive do
      {:start, id} -> IO.puts("Starting process: #{id}")
    end
    receive do
      {:end, message} -> IO.puts(message)
    end
  end

  def create_process(i) do 
    pid = spawn(&ScaleTest.sleeper/0)
    send(pid, {:start, i})
    pid
  end

  def app(max) do
    IO.puts("App started.")
    processes = Enum.map(0..max, &ScaleTest.create_process/1)
    Process.sleep(30000)
    Enum.each(processes, fn i -> send(i, {:end, "end"}) end)
  end

  def start(_type, args) do
    max = Enum.at(args, 0)
    IO.puts("Max: #{max}")
    Task.start(fn -> app(max) end)
  end

end
