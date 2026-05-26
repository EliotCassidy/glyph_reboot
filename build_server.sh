# update and upgrade
sudo apt-get update && sudo apt-get upgrade

# Install nginx
sudo apt-get install -y nginx


# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# Install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install -y yarn

# Install docker
sudo apt-get remove docker docker-engine docker.io containerd runc

sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

sudo groupadd docker
sudo usermod -aG docker $USER

sudo systemctl enable docker.service
sudo systemctl enable containerd.service

# Docker compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose


# git aware prompt
mkdir ~/.bash
cd ~/.bash
git clone git://github.com/jimeh/git-aware-prompt.git


# Setup git repo
cd ~
mkdir glyph && cd glyph
mkdir code repo && cd repo
git init --bare
cd hooks
touch post-receive

echo "#!/bin/sh" > post-receive
echo "git --work-tree=/home/ubuntu/glyph/code --git-dir=/home/ubuntu/glyph/repo checkout -f" >> post-receive

chmod +x post-receive

echo "ssh://ubuntu@54.237.102.121/home/ubuntu/glyph/repo"

"ssh://sako@mintex.shh.mpg.de/home/sako/glyph/repo"