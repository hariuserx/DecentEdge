echo 'deb [arch=amd64] https://download.01.org/intel-sgx/sgx_repo/ubuntu focal main' | sudo tee /etc/apt/sources.list.d/intel-sgx.list
wget -qO - https://download.01.org/intel-sgx/sgx_repo/ubuntu/intel-sgx-deb.key | sudo apt-key add -
echo "deb http://apt.llvm.org/focal/ llvm-toolchain-focal-10 main" | sudo tee /etc/apt/sources.list.d/llvm-toolchain-focal-10.list
wget -qO - https://apt.llvm.org/llvm-snapshot.gpg.key | sudo apt-key add -
echo "deb [arch=amd64] https://packages.microsoft.com/ubuntu/20.04/prod focal main" | sudo tee /etc/apt/sources.list.d/msprod.list
wget -qO - https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
sudo apt update

sudo apt-get install python3-pip
sudo pip3 install cmake
ls /opt/openenclave # make sure that it is present
source /opt/openenclave/share/openenclave/openenclaverc
sudo apt -y install dkms
wget https://download.01.org/intel-sgx/sgx-linux/2.17/distro/ubuntu20.04-server/sgx_linux_x64_driver_1.41.bin -O sgx_linux_x64_driver.bin # depending on your OS
chmod +x sgx_linux_x64_driver.bin
sudo ./sgx_linux_x64_driver.bin
sudo apt-get install linux-headers-$(uname -r)

# If not already installed
sudo apt -y install clang-10 libssl-dev gdb libsgx-enclave-common libsgx-quote-ex libprotobuf17 libsgx-dcap-ql libsgx-dcap-ql-dev az-dcap-client open-enclave
sudo apt -y install ninja-build
sudo apt-get install build-essential
sudo apt-get install dh-autoconf
sudo apt-get install autoconf
sudo apt-get install libtool

# We had to override the default GCC for compatability
oeapkman add gcc
oeapkman add libgcc-10.3.1_git20210424-r2
oeapkman add libgcc
oeapkman add build-base
oeapkman add libtirpc-dev
oeapkman add libtirpc
oeapkman add libtirpc-dev
oeapkman add procps
oeapkman add procps-dev
oeapkman add imlib2
oeapkman add imlib2-dev
oeapkman add make
oeapkman add make-dev

# Required libraries for cryptographic attestation within the enclave
# We are using the enclave package manager
oeapkman add libsecp256k1
oeapkman add libsecp256k1-dev
oeapkman add gcompat
oeapkman add gcompat-dev
oeapkman add libc6-compat


# Install node and npm
sudo apt install nodejs npm