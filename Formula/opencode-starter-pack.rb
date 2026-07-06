class OpencodeStarterPack < Formula
  desc "One-command starter kit for OpenCode: skills, MCP configs, rules, and prompts"
  homepage "https://github.com/PETERGS27/OpenCodeStarterPack"
  url "https://github.com/PETERGS27/OpenCodeStarterPack/archive/refs/tags/v1.0.0.tar.gz"
  sha256 "0000000000000000000000000000000000000000000000000000000000000000" # Placeholder
  license "MIT"

  depends_on "node"

  def install
    libexec.install Dir["*"]
    bin.install_symlink libexec/"install.sh" => "OpenCodeStarterPack"
  end

  test do
    assert_match "OpenCodeStarterPack", shell_output("#{bin}/OpenCodeStarterPack --help")
  end
end
