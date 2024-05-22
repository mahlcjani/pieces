with import <nixpkgs> {};

mkShellNoCC {
    packages = [
        act
        git
        k6
        nodejs
        openssh
        vim
    ];
    shellHook = ''
        echo Updating packages...
        npm install
    '';
}

